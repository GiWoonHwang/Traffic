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

    public void create(Post post, MemberDto memberDto) {
        var postLike = PostLike.builder()
                .postId(post.getId())
                .memberId(memberDto.id())
                .build();
        postLikeRepository.save(postLike);
    }
}
