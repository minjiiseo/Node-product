export default (err, req, res, next) => {
  console.log('에러처리 미들웨어가 실행되었습니다.');
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ errorMessage: err.message });
  }
  //서버에 문제 생길시
  return res.status(500).json({ errorMessage: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.' });
};
