package com.delose.pfms.goal_service.service.impl;

import com.delose.pfms.goal_service.entity.Goal;
import com.delose.pfms.goal_service.repository.GoalRepository;
import com.delose.pfms.goal_service.service.GoalService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;

    public GoalServiceImpl(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    @Override
    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    @Override
    public Goal getGoalById(Long id) {
        return goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));
    }

    @Override
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    @Override
    public Goal updateGoal(Long id, Goal updatedGoal) {
        Goal existing = getGoalById(id);

        existing.setTitle(updatedGoal.getTitle());
        existing.setDescription(updatedGoal.getDescription());
        existing.setCompleted(updatedGoal.isCompleted());

        return goalRepository.save(existing);
    }

    @Override
    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}