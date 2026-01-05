package com.delose.pfms.budget_service.mapper;

import com.delose.pfms.budget_service.dto.BudgetNotification;
import com.delose.pfms.budget_service.entity.Budget;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BudgetMapper {

    @Mapping(target = "id", source = "budget.id")
    @Mapping(target = "userId", source = "budget.userId")
    @Mapping(target = "subject", constant = "Producer Test")
    @Mapping(target = "channel", constant = "SMS")
    @Mapping(target = "messageBody", expression = "java(\"Budget created for category: \" + budget.getCategory())")
    BudgetNotification toNotification(Budget budget);
}