# 상품 CRUD api

## 상품 데이터 schema 
* name
* description
* manager
* password
* status
* createdAt
* updatedAt


## POST
직접 상품명,설명,담당자,비밀번호 추가 기능 <br/>
상품 등록시 FOR_SALE이 기본상태로 추가되는 기능 <br/>
생성일시, 수정일시 자동생성기능 <br/>
중복상품 에러처리 기능 <br/>

## GET ( 상품 목록 조회 )
등록된 상품 조회 기능  <br/>
비밀번호는 포함되지 않게 조회 <br/>
생성 일시를 기준으로 내림차순하는 기능  <br/>
상품 목록 조회시 없는 경우 빈 배열 반환 

## GET ( 상품 상세 조회 )
상품 ID로 상품 조회하는 기능  <br/>
비밀번호는 포함되지 않게 조회 <br/>
상품 미존재 에러처리기능 

## PUT ( 수정 )
상품명, 설명, 담당자, 상태를 수정하는 기능  <br/>
상품 미존재 에러처리기능  <br/>
비밀번호 일치여부 확인 및 유효성 검증 <br/>
수정 시 상태 여부 유효성 검증

## DELETE ( 삭제 )
비밀번호 일치여부 확인 후 삭제하는 기능 <br/>
상품 미존재 에러처리기능 <br/>
비밀번호 유효성 검증


