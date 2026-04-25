package com.andrii.nekon.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// Храним bucket для каждого IP адреса
// ConcurrentHashMap — потокобезопасный, важно для веб-сервера
@Service
public class RateLimitService {


    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    // Получить или создать bucket для IP
    public Bucket resolveBucket(String ip) {
        return buckets.computeIfAbsent(ip, this::createNewBucket);
    }

    private Bucket createNewBucket(String ip) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(5)
                .refillIntervally(5, Duration.ofMinutes(1))
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    // Проверить можно ли делать запрос
    public boolean tryConsume(String ip) {
        return resolveBucket(ip).tryConsume(1);
    }
}