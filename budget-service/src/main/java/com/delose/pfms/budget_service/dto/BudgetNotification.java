package com.delose.pfms.budget_service.dto;

public class BudgetNotification {
    private Long id;
    private String userId;
    private String subject;
    private String messageBody;
    private String channel;

    public BudgetNotification(Long id, String userId, String subject, String messageBody, String channel) {
        this.id = id;
        this.userId = userId;
        this.subject = subject;
        this.messageBody = messageBody;
        this.channel = channel;
    }

    @Override
    public String toString() {
        return "BudgetNotification{" +
                "id=" + id +
                ", userId='" + userId + '\'' +
                ", subject='" + subject + '\'' +
                ", messageBody='" + messageBody + '\'' +
                ", channel='" + channel + '\'' +
                '}';
    }

    public BudgetNotification() {
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