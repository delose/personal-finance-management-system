package com.delose.pfms.notification_service.dto;

public class NotificationRequest {
    private String userId;
    private String recipient;
    private String subject;
    private String messageBody;
    private String channel;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
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

    public NotificationRequest(String userId, String recipient, String subject, String messageBody, String channel) {
        this.userId = userId;
        this.recipient = recipient;
        this.subject = subject;
        this.messageBody = messageBody;
        this.channel = channel;
    }

    public NotificationRequest() {
    }

    @Override
    public String toString() {
        return "NotificationRequest{" +
                "userId='" + userId + '\'' +
                ", recipient='" + recipient + '\'' +
                ", subject='" + subject + '\'' +
                ", messageBody='" + messageBody + '\'' +
                ", channel='" + channel + '\'' +
                '}';
    }
}
