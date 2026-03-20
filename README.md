# 📚 스터디 플래너

귀여운 인터페이스와 함께 공부 일정을 효과적으로 관리할 수 있는 웹 기반 스터디 플래너입니다.

## 📋 주요 기능

- 📅 캘린더 기반 일정 관리
- 🎨 커스터마이징 가능한 인터페이스 (색상, 아이콘)
- 🌙 다크/라이트 모드 지원
- 💾 LocalStorage 데이터 저장
- 🗑️ 데이터 초기화 기능

## 🚀 시작하기

### 설치 방법

1. 이 저장소를 클론합니다:
```bash
git clone https://github.com/hjin118/study-planner.git
cd study-planner
```

2. `index.html` 파일을 브라우저에서 엽니다:
```
index.html
```

### 사용 방법

1. **일정 추가**: 상단 입력창에 공부할 내용, 날짜를 입력하고 색상과 아이콘을 선택한 후 추가 버튼을 클릭합니다.
2. **캘린더 네비게이션**: 이전/다음 버튼으로 월을 이동할 수 있습니다.
3. **커스터마이징**: ⚙️ 버튼을 클릭하여 인터페이스 색상, 앱 아이콘 등을 변경할 수 있습니다.
4. **테마 변경**: 🌙 버튼으로 다크 모드/라이트 모드를 전환할 수 있습니다.

## 📂 파일 구조

```
study-planner/
├── index.html          # 메인 페이지
├── style.css           # 스타일 시트
├── main.js             # 메인 JavaScript 로직
├── clear-storage.js    # 스토리지 정리 스크립트
├── clear-data.html     # 데이터 초기화 페이지
└── README.md           # 이 파일
```

## 🛠️ 기술 스택

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage API

## 💾 데이터 관리

- 모든 데이터는 브라우저의 LocalStorage에 저장됩니다.
- 데이터를 초기화하려면 `clear-data.html` 페이지를 열고 "모든 데이터 삭제" 버튼을 클릭하세요.

## 📝 라이선스

이 프로젝트는 무료로 사용할 수 있습니다.
(the image used in this project and the character is not mine. All rights belong to their respectful owners. Thank you.)
