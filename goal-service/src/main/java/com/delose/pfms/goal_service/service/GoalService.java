package com.delose.pfms.goal_service.service;

import com.delose.pfms.goal_service.entity.Goal;

import java.util.List;

public interface GoalService {

    Goal createGoal(Goal goal);

    Goal getGoalById(Long id);

    List<Goal> getAllGoals();

    Goal updateGoal(Long id, Goal goal);

    void deleteGoal(Long id);
}
