package com.delose.pfms.notification_service.dto;

public class NotificationRequest {
    private Long id;
    private String userId;
    private String subject;
    private String messageBody;
    private String channel;

    public NotificationRequest() {
    }

    public NotificationRequest(Long id, String userId, String subject, String messageBody, String channel) {
        this.id = id;
        this.userId = userId;
        this.subject = subject;
        this.messageBody = messageBody;
        this.channel = channel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessageBody() {
        return messageBody;
    }

    public void setMessageBody(String messageBody) {
        this.messageBody = messageBody;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }
}
