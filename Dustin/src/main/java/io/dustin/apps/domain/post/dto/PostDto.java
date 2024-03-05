package io.dustin.apps.domain.post.dto;

import java.time.LocalDateTime;

public record PostDto(Long id, Long memberId, String contents, LocalDateTime createdAt, Long likeCount) {

}
