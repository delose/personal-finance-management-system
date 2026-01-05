package com.delose.pfms.budget_service.producer;

import com.delose.pfms.budget_service.dto.BudgetNotification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class BudgetNotificationHandler {
    private final BudgetNotificationProducer budgetNotificationProducer;

    public BudgetNotificationHandler(BudgetNotificationProducer budgetNotificationProducer) {
        this.budgetNotificationProducer = budgetNotificationProducer;
    }

    @Async // Runs on a separate thread pool
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleBudgetNotification(BudgetNotification request) {
        // 3. Send message ONLY after DB transaction commits
        budgetNotificationProducer.sendBudgetRequest(request);
    }
}
