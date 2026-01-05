package com.delose.pfms.budget_service.service;

import com.delose.pfms.budget_service.dto.BudgetNotification;
import com.delose.pfms.budget_service.entity.Budget;
import com.delose.pfms.budget_service.mapper.BudgetMapper;
import com.delose.pfms.budget_service.repository.BudgetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    private static final Logger log = LoggerFactory.getLogger(BudgetService.class);

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private BudgetMapper budgetMapper;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public List<Budget> findAllBudgets() {
        return this.budgetRepository.findAll();
    }

    @Transactional
    public Budget saveBudget(Budget budget) {
        Budget savedBudget = this.budgetRepository.save(budget);

        BudgetNotification notification = budgetMapper.toNotification(savedBudget);

        eventPublisher.publishEvent(notification);

        return savedBudget;
    }

    @Cacheable(value = "budgets")
    public Optional<Budget> findBudgetById(Long id) {
        long start = System.currentTimeMillis();
        Optional<Budget> b = this.budgetRepository.findById(id);
        log.info("Cache MISS - ID: {} | Execution: {}ms", id, (System.currentTimeMillis() - start));
        return b;
    }
}
