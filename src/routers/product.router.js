import express from 'express';
import Product from '../schemas/product.schema.js';
import Joi from 'joi';

// express 라우터 생성
const router = express.Router();

// joi를 사용한 상품 유효성 검사
const productSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': '상품명을 입력해 주세요.',
    }),
    description: Joi.string().required().messages({
        'any.required': '상품 설명을 입력해 주세요.',
    }),
    manager: Joi.string().required().messages({
        'any.required': '담당자를 입력해 주세요.',
    }),
    password: Joi.string().required().messages({
        'any.required': '비밀번호를 입력해 주세요.',
    }),
});

// 상품 생성 API
router.post('/products', async (req, res, next) => {
    try {
        // 유효성 검사
        const validateBody = await productSchema.validateAsync(req.body);

        const { name, description, manager, password } = validateBody;

        // 등록된 상품명 확인
        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return res.status(400).json({ message: '이미 등록된 상품입니다.' });
        }

        const currentTime = new Date();
        // 상품 생성
        const product = new Product({
            name,
            description,
            manager,
            password,
            status: 'FOR_SALE',
            createdAt: currentTime,
            updatedAt: currentTime,
        });

        // 데이터베이스에 상품 저장
        await product.save();

        // 클라이언트에게 응답 반환
        return res.status(201).json({ product: product });
    } catch (error) {
        // Joi 유효성 검사 에러 처리
        if (error.isJoi) {
            const errorMessage = error.details
                .map((err) => err.message)
                .join(', ');
            return res.status(400).json({ message: errorMessage });
        }
        // 에러 처리 미들웨어로 에러 전달
        next(error);
    }
});

// GET 상품 목록 조회 API
router.get('/products', async (req, res, next) => {
    try {
        // 상품 목록 조회
        const search = await Product.find({}, '-password') // 비밀번호 필드를 제외하고 조회
            .sort({ createdAt: -1 }) // 생성 일시를 기준으로 내림차순 정렬
            .select('_id name description manager status createdAt updatedAt'); // 필요한 필드만 선택

        // 조회된 상품이 없는 경우 [] 반환
        if (!search || search.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(search);
    } catch (error) {
        next(error);
    }
});

// 상품 상세 조회 API
router.get('/products/:productId', async (req, res, next) => {
    try {
        // 상품 ID를 Path Parameter에서 추출
        const { productId } = req.params;

        // 상품 조회
        const product = await Product.findById(productId).select('-password');

        if (!product) {
            // 상품이 없는 경우
            return res
                .status(404)
                .json({ message: '상품을 찾을 수 없습니다.' });
        }

        return res.status(200).json({ product });
    } catch (error) {
        next(error);
    }
});

// 상품 수정 API
router.put('/products/:productId', async (req, res, next) => {
    try {
        // 변경할 ID 값을 가져옵니다.
        const { productId } = req.params;

        const { name, description, manager, status, password } = req.body;

        // 상품 조회
        const product = await Product.findById(productId);

        if (!product) {
            // 상품이 없는 경우
            return res
                .status(404)
                .json({ message: '상품이 존재하지 않습니다.' });
        }

        // 비밀번호 확인
        if (password === undefined) {
            // 상품에 비밀번호가 없는 경우
            return res
                .status(400)
                .json({ message: '비밀번호를 입력해주세요.' });
        }
        // 상품 비밀번호 일치하지 않는경우
        if (product.password !== password) {
            return res
                .status(403)
                .json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        // 상품 상태가 유효한지 확인
        if (status !== 'FOR_SALE' && status !== 'SOLD_OUT') {
            return res.status(400).json({
                message: '상품 상태는 [FOR_SALE, SOLD_OUT] 중 하나여야 합니다.',
            });
        }

        // 비밀번호가 일치하는 경우 상품 정보 업데이트
        product.name = name;
        product.description = description;
        product.manager = manager;
        product.status = status;

        // 수정된 상품 저장
        await product.save();

        return res.status(200).json({ product });
    } catch (error) {
        next(error);
    }
});

// 상품 삭제 API
router.delete('/products/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { password } = req.body;

        // 상품 조회
        const product = await Product.findById(productId);

        if (!product) {
            return res
                .status(404)
                .json({ message: '상품이 존재하지 않습니다.' });
        }

        // 비밀번호 확인
        if (password === undefined) {
            return res
                .status(400)
                .json({ message: '비밀번호를 입력해주세요.' });
        }
        // 비밀번호 일치하지 않는 경우
        if (product.password && product.password !== password) {
            return res
                .status(403)
                .json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        // 상품 삭제
        await Product.findByIdAndDelete(productId);

        return res
            .status(200)
            .json({ message: '상품이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        next(error);
    }
});

export default router;
