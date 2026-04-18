package com.andrii.nekon.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

// Отправляем сообщение в Telegram когда создаётся новый заказ.
// RestTemplate — стандартный HTTP клиент Spring для внешних запросов.
@Service
@RequiredArgsConstructor
public class TelegramService {

    // Берём токен и chat id из application.properties
    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    private final RestTemplate restTemplate;

    public void sendMessage(String text) {
        String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";

        // Тело запроса к Telegram API
        Map<String, String> body = Map.of(
                "chat_id", chatId,
                "text", text,
                "parse_mode", "HTML" // поддержка жирного текста и т.д.
        );

        try {
            restTemplate.postForObject(url, body, String.class);
        } catch (Exception e) {
            // Не ломаем заказ если Telegram недоступен — просто логируем
            System.err.println("Telegram notification failed: " + e.getMessage());
        }
    }
}