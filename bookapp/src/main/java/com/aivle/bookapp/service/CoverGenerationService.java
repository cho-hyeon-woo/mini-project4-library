//package com.aivle.bookapp.service;
//
//import java.time.LocalDateTime;
//
//@Service
//@RequiredArgsConstructor
//
//public class CoverGenerationService {
//
//    private final CoverGenerationRepository coverGenerationRepository;
//
//    // AI 표지 생성 - 생성 및 설정값 저장
//    public CoverGeneration generateCover(CoverGeneration coverGeneration) {
//
//        // TODO 1: 생성 요청 시작 상태 설정
//        // OpenAI API 응답을 기다리는 동안 "생성 중" 상태 저장
//        coverGeneration.setStatus("PENDING");
//
//        // TODO 2: 생성 요청 시각 저장
//        // 나중에 completed_at과 비교해서 생성 소요 시간 계산에 사용
//        coverGeneration.setCreatedAt(LocalDateTime.now());
//
//        try {
//            // TODO 3: OpenAI API 호출
//            // 아래 설정값들을 OpenAI API에 전달해서 실제 이미지 생성 요청
//            // - coverGeneration.getImageModel()   : 사용할 AI 모델 (ex. gpt-image-2)
//            // - coverGeneration.getImageQuality() : 이미지 품질 (ex. low, high)
//            // - coverGeneration.getOutputFormat() : 이미지 형식 (ex. png)
//            // - coverGeneration.getCoverStyle()   : 표지 스타일 (ex. 미니멀)
//            // - coverGeneration.getPrompt()       : 표지 생성에 사용할 텍스트 프롬프트
//
//            // TODO 4: OpenAI API 호출 성공 시 처리
//            // 이미지가 정상적으로 생성되면 완료 상태와 완료 시각 저장
//            coverGeneration.setStatus("COMPLETED");
//            coverGeneration.setCompletedAt(LocalDateTime.now());
//
//        } catch (Exception e) {
//            // TODO 5: OpenAI API 호출 실패 시 처리
//            // API Key 오류, 네트워크 오류, 잔액 부족 등 실패 상황에서 실패 상태 저장
//            coverGeneration.setStatus("FAILED");
//        }
//
//        return coverGenerationRepository.save(coverGeneration);
//    }
//}