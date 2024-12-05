from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import subprocess
import os
from io import BytesIO
import json

app = FastAPI()

# uvicorn main:app --reload

# 파이썬 코드 실행 함수
def run_python_script(image_path: str):
    try:
        # 파이썬 스크립트를 실행하고 결과를 가져옴
        result = subprocess.run(
            ['python', './return_prediction_entropy_v6.py', image_path],  # 파이썬 파일 경로
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        if result.returncode == 0:
            return result.stdout  # 출력 결과 반환
        else:
            raise Exception(f"Error: {result.stderr}")
    except Exception as e:
        return str(e)

# ai 이미지 분류 엔드포인트
@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    try:
        # 이미지 파일 받기
        image_bytes = await file.read()

        # 이미지 파일을 임시 파일로 저장
        image_path = "temp_image.jpg"
        with open(image_path, "wb") as f:
            f.write(image_bytes)

        # 파이썬 코드 실행
        output = run_python_script(image_path)

        # 임시 파일 삭제
        os.remove(image_path)

        # 결과를 파싱
        result_data = output.strip()
        print(f"result: {result_data}")
        # JSON 문자열을 파싱하여 딕셔너리로 변환
        parsed_result = json.loads(result_data)

        # 파싱된 값 추출
        predicted_class_name = parsed_result["predicted_class"]
        entropy = parsed_result["entropy"]

        # 반환할 데이터 구조
        return JSONResponse(content={
            "predicted_class": predicted_class_name,  # 세탁처럼 Unicode가 제대로 처리됨
            "entropy": entropy  # 부동소수점 값 그대로
        })

        # predicted_class_name, entropy = result_data.split(",")

        # return JSONResponse(content={
        #     "predicted_class": predicted_class_name.split(":")[1].strip(),
        #     "entropy": float(entropy.split(":")[1].strip())
        # })
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
