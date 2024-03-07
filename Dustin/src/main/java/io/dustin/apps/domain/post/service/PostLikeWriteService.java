package io.dustin.apps.domain.post.service;

import io.dustin.apps.domain.member.dto.MemberDto;
import io.dustin.apps.domain.post.entity.Post;
import io.dustin.apps.domain.post.entity.PostLike;
import io.dustin.apps.domain.post.repository.PostLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PostLikeWriteService {
    final private PostLikeRepository postLikeRepository;

    /**
     * 동시성 테스트 진행하기
     * 디버그 모드 실행
     * 브레이크 포인트 설정
     * 우클릭 후 suspend 옵션을 Thread로 변경 (All로 선택 시 하나의 요청씩 처리함)
     */
    public void create(Post post, MemberDto memberDto) {
        var postLike = PostLike.builder()
                .postId(post.getId())
                .memberId(memberDto.id())
                .build();
        postLikeRepository.save(postLike);
    }
}
