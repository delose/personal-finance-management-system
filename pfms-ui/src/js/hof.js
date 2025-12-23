/**
 * ============================================================================
 * HIGHER-ORDER FUNCTIONS (HOFs) - COMPREHENSIVE GUIDE
 * ============================================================================
 *
 * WHAT IS A HIGHER-ORDER FUNCTION?
 * --------------------------------
 * A Higher-Order Function (HOF) is a function that either:
 *   1. Takes one or more functions as arguments, OR
 *   2. Returns a function as its result, OR
 *   3. Both of the above
 *
 * Think of it like this: In regular programming, you work with data (numbers,
 * strings, objects). In functional programming with HOFs, you work with
 * functions AS data. You can pass functions around, store them, create them
 * dynamically, and combine them - just like you would with any other value.
 *
 *
 * WHY ARE HIGHER-ORDER FUNCTIONS USEFUL?
 * ---------------------------------------
 * 1. **Code Reusability**: Instead of writing similar functions over and over,
 *    you can create one function that accepts different behaviors as parameters.
 *
 * 2. **Abstraction**: You can separate "what to do" (the function) from
 *    "how to do it" (the logic that applies the function).
 *
 * 3. **Composition**: You can build complex behavior by combining simple
 *    functions, like building blocks.
 *
 * 4. **Flexibility**: You can create functions dynamically based on conditions
 *    or parameters, making your code more adaptable.
 *
 *
 * THE TWO MAIN TYPES OF HOFs:
 * ---------------------------
 *
 * Type 1: Functions that ACCEPT functions as arguments
 *   Example: Array.map(), Array.filter(), Array.reduce()
 *   These are functions that take another function and apply it to data.
 *
 * Type 2: Functions that RETURN functions
 *   Example: The functions below - they create and return new functions
 *   This is where the real power comes in: you can create specialized
 *   functions on-the-fly based on parameters.
 *
 *
 * NESTED HIGHER-ORDER FUNCTIONS:
 * ------------------------------
 * This is when a HOF returns a function, which itself returns a function,
 * which might return yet another function, and so on. This creates a
 * "chain" where you can configure behavior step by step.
 *
 * Think of it like a factory that makes factories that make products:
 *   Factory → Creates Factory → Creates Factory → Creates Product
 *
 * Each level of nesting allows you to configure one more aspect of the
 * final behavior. This is called "partial application" or "currying."
 *
 *
 * COMMON PATTERNS YOU'LL SEE:
 * ---------------------------
 * 1. **Factory Functions**: Functions that create other functions
 * 2. **Closures**: Inner functions that "remember" variables from outer scope
 * 3. **Currying**: Converting multi-argument functions into nested single-arg functions
 * 4. **Partial Application**: Pre-filling some arguments of a function
 * 5. **Decorators**: Wrapping functions to add behavior (logging, caching, etc.)
 * 6. **Composition**: Combining functions to create new behavior
 *
 *
 * HOW TO READ THESE EXAMPLES:
 * ---------------------------
 * Read each example carefully, step by step. Pay attention to:
 * - What the outer function receives
 * - What it returns (always a function!)
 * - What that returned function receives
 * - What it returns (another function or a result)
 * - How the nesting creates progressively more specialized functions
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * EXAMPLE 1: DISCOUNT APPLICATOR
 * ============================================================================
 *
 * WHAT THIS DOES:
 * This creates a discount system that works in 3 steps:
 *   1. Step 1: Choose discount type (percentage or fixed)
 *   2. Step 2: Specify the discount amount (10%, or $5, etc.)
 *   3. Step 3: Apply it to a list of items
 *
 * WHY IT'S NESTED:
 * We use 3 levels of nesting because we want to configure 3 different things:
 * - Level 1: The TYPE of discount (percentage vs fixed)
 * - Level 2: The AMOUNT of discount (10, 5, etc.)
 * - Level 3: The ITEMS to apply it to
 *
 * HOW IT WORKS:
 * - When you call createDiscountApplicator('percentage'), it returns a function
 * - That function, when called with (10), returns another function
 * - That final function, when called with items, applies the discount
 *
 * REAL-WORLD ANALOGY:
 * It's like ordering a pizza:
 *   Step 1: "I want a pizza" → createDiscountApplicator('percentage')
 *   Step 2: "Make it large" → (10)  // 10% discount
 *   Step 3: "Deliver it here" → (items)  // apply to these items
 */
function createDiscountApplicator(discountType) {
  // This is LEVEL 1: We configure the discount type (percentage or fixed)
  // When this function is called, it captures 'discountType' in a closure
  // (a closure is when an inner function "remembers" variables from outer scope)

  return function(discountAmount) {
    // This is LEVEL 2: We configure how much discount to apply
    // This function also remembers 'discountType' from the outer scope!
    // This is the magic of closures - inner functions have access to outer variables

    return function(items) {
      // This is LEVEL 3: Now we actually do the work
      // This function has access to BOTH 'discountType' AND 'discountAmount'
      // This is where the actual discount logic happens

      if (discountType === 'percentage') {
        // For percentage: multiply price by (1 - discount/100)
        // Example: 10% off means multiply by 0.9 (1 - 0.10)
        return items.map(item => ({
          ...item,  // Spread operator copies all properties
          price: item.price * (1 - discountAmount / 100)  // Apply percentage discount
        }));
      } else if (discountType === 'fixed') {
        // For fixed: subtract the discount amount, but don't go below 0
        return items.map(item => ({
          ...item,
          price: Math.max(0, item.price - discountAmount)  // Apply fixed discount
        }));
      }
      return items;  // If neither type matches, return items unchanged
    };
  };
}

// USAGE BREAKDOWN (step by step):
//
// Step 1: Create a percentage discount applicator
//   const percentageDiscount = createDiscountApplicator('percentage');
//   Now 'percentageDiscount' is a function waiting for a discount amount
//
// Step 2: Specify the discount amount (10%)
//   const tenPercentOff = percentageDiscount(10);
//   Now 'tenPercentOff' is a function waiting for items to process
//
// Step 3: Apply to items
//   const discountedItems = tenPercentOff(cartItems);
//   Now we get the final result: items with 10% off
//
// OR, you can chain it all at once:
//   const discountedItems = createDiscountApplicator('percentage')(10)(cartItems);
//
// Why chain? Each call returns a function, so you can immediately call it again!
// This is called "currying" - converting multi-argument functions into
// a series of single-argument function calls.


/**
 * ============================================================================
 * EXAMPLE 2: PRICING RULE BUILDER
 * ============================================================================
 *
 * WHAT THIS DOES:
 * Creates a flexible system for building pricing rules. A rule has two parts:
 *   1. A CONDITION: "When should this rule apply?" (e.g., "if more than 3 items")
 *   2. An ACTION: "What should happen?" (e.g., "give $5 discount per item")
 *
 * WHY IT'S NESTED:
 * We nest 4 levels deep to configure:
 *   Level 1: Create the builder (no config needed, just starts the process)
 *   Level 2: Provide the CONDITION function
 *   Level 3: Provide the ACTION function
 *   Level 4: Actually check and apply the rule to items
 *
 * HOW IT WORKS:
 * This uses a pattern called "Builder Pattern" - you build up configuration
 * step by step, then execute it. It's like building a recipe before cooking.
 *
 * REAL-WORLD ANALOGY:
 * It's like programming a smart home device:
 *   Step 1: "Create a new rule" → createPricingRuleBuilder()
 *   Step 2: "When temperature > 75" → (condition function)
 *   Step 3: "Turn on AC" → (action function)
 *   Step 4: "Now check and execute" → (items)
 */
function createPricingRuleBuilder() {
  // LEVEL 1: This just starts the building process
  // It returns a function that expects a condition

  return function(conditionFn) {
    // LEVEL 2: We provide a function that checks WHEN the rule should apply
    // conditionFn is a function that takes items and returns true/false
    // Example: (items) => items.length > 3
    // This means "apply rule when there are more than 3 items"

    return function(actionFn) {
      // LEVEL 3: We provide a function that defines WHAT happens
      // actionFn is a function that takes items and returns a result
      // Example: (items) => ({ discount: items.length * 5 })
      // This means "give $5 discount per item"

      return function(items) {
        // LEVEL 4: Now we actually execute the rule
        // This is where we check the condition and apply the action

        if (conditionFn(items)) {
          // If condition is true, execute the action
          return actionFn(items);
        }
        // If condition is false, return no discount/no items
        return { discount: 0, addItems: [] };
      };
    };
  };
}

// USAGE BREAKDOWN:
//
// Step 1: Create a builder
//   const ruleBuilder = createPricingRuleBuilder();
//
// Step 2: Define when to apply (condition)
//   const bulkDiscountRule = ruleBuilder(
//     (items) => items.length > 3  // Condition: more than 3 items
//   );
//
// Step 3: Define what to do (action)
//   const bulkDiscountRule = ruleBuilder(
//     (items) => items.length > 3
//   )(
//     (items) => ({ discount: items.length * 5 })  // Action: $5 off per item
//   );
//
// Step 4: Apply to items
//   const result = bulkDiscountRule(cartItems);
//
// This creates a reusable rule that you can apply to any cart!


/**
 * ============================================================================
 * EXAMPLE 3: FUNCTION COMPOSITION
 * ============================================================================
 *
 * WHAT THIS DOES:
 * Combines multiple functions into a single function. It's like a pipeline
 * where data flows through multiple transformations.
 *
 * HOW IT WORKS:
 * compose(f, g, h)(x) means: h(g(f(x)))
 * Functions are applied from right to left (reduceRight)
 *
 * REAL-WORLD ANALOGY:
 * Like an assembly line in a factory:
 *   Raw material → Step 1 → Step 2 → Step 3 → Finished product
 *   Data → Function 1 → Function 2 → Function 3 → Final result
 */
function compose(...fns) {
  // '...fns' means "collect all arguments into an array called fns"
  // This allows you to pass any number of functions

  return function(initialValue) {
    // This function takes the starting value and pipes it through all functions

    return fns.reduceRight((value, fn) => {
      // reduceRight goes through functions from RIGHT to LEFT
      // This is composition: f(g(h(x))) means h runs first, then g, then f

      if (typeof fn === 'function') {
        return fn(value);  // Apply function to current value
      }
      return value;  // Skip non-functions
    }, initialValue);
  };
}

// USAGE:
// const addOne = x => x + 1;
// const multiplyByTwo = x => x * 2;
// const square = x => x * x;
//
// const transform = compose(square, multiplyByTwo, addOne);
// const result = transform(3);
//
// This means: square(multiplyByTwo(addOne(3)))
// Step by step: 3 → 4 → 8 → 64


/**
 * ============================================================================
 * EXAMPLE 4: CONDITIONAL RULE CHAIN
 * ============================================================================
 *
 * WHAT THIS DOES:
 * Creates a system where you can chain multiple rules together, like an
 * "if-then" statement chain. Each rule has a condition and an action.
 *
 * WHY IT'S USEFUL:
 * Instead of writing nested if-else statements, you can build rules
 * declaratively and execute them all at once.
 *
 * HOW IT WORKS:
 * Uses a "fluent API" pattern - methods return 'this' so you can chain calls.
 * It's like jQuery's chaining: $('.item').addClass('active').show().fadeIn()
 */
function createRuleChain() {
  const rules = [];  // Store all rules in an array
  // This array is captured in a closure - the returned object has access to it

  return {
    add: function(conditionFn) {
      // This method expects a condition function
      // It returns an object with 'then' and 'execute' methods

      return {
        then: function(actionFn) {
          // 'then' expects an action function
          // We store the condition-action pair in the rules array
          rules.push({ condition: conditionFn, action: actionFn });

          return this;  // Return 'this' to allow chaining
          // 'this' refers to the object with 'add', 'then', 'execute'
        },
        execute: function(items) {
          // This runs all rules and combines their results
          let result = { discount: 0, addItems: [] };

          rules.forEach(rule => {
            // For each rule, check if condition is true
            if (rule.condition(items)) {
              // If true, execute the action and accumulate results
              const ruleResult = rule.action(items);
              result.discount += (ruleResult.discount || 0);
              result.addItems = result.addItems.concat(ruleResult.addItems || []);
            }
          });

          return result;
        }
      };
    }
  };
}

// USAGE:
// const chain = createRuleChain();
// chain
//   .add(items => items.length > 3)           // Condition: more than 3 items
//     .then(items => ({ discount: 10 }))      // Action: $10 discount
//   .add(items => items.some(i => i.code === 'ult_small'))  // Condition: has ult_small
//     .then(items => ({ discount: 5 }))       // Action: $5 more discount
//   .execute(cartItems);                       // Execute all rules
//
// If both conditions are true, you get $15 total discount!


/**
 * ============================================================================
 * EXAMPLE 5: FILTER AND TRANSFORM PIPELINE
 * ============================================================================
 *
 * WHAT THIS DOES:
 * Creates a pipeline system similar to SQL or LINQ. You can filter items,
 * transform them, and then reduce them to a single value - all in a chain.
 *
 * HOW IT WORKS:
 * Uses the "builder pattern" again. You build up a list of operations,
 * then execute them all at once when you call reduce().
 *
 * WHY IT'S NESTED:
 * - filter() and map() add steps to the pipeline (fluent API)
 * - reduce() needs TWO more levels: initial value, then items to process
 *   This is because reduce needs to know the starting value AND what to reduce
 */
function createPipeline() {
  const steps = [];  // Store pipeline steps

  return {
    filter: function(predicateFn) {
      // predicateFn: a function that returns true/false
      // Example: item => item.price > 20 (keep items over $20)
      steps.push({ type: 'filter', fn: predicateFn });
      return this;  // Allow chaining
    },

    map: function(transformFn) {
      // transformFn: a function that transforms each item
      // Example: item => item.price (extract just the price)
      steps.push({ type: 'map', fn: transformFn });
      return this;  // Allow chaining
    },

    reduce: function(reducerFn) {
      // LEVEL 1: reducerFn defines HOW to combine values
      // Example: (sum, price) => sum + price (add them up)

      return function(initialValue) {
        // LEVEL 2: initialValue is the starting point
        // Example: 0 (start counting from 0)

        return function(items) {
          // LEVEL 3: items is what we're processing
          // This is where we actually execute the pipeline

          let result = items;

          // Execute all filter and map steps in order
          steps.forEach(step => {
            if (step.type === 'filter') {
              result = result.filter(step.fn);  // Keep items where fn returns true
            } else if (step.type === 'map') {
              result = result.map(step.fn);     // Transform each item
            }
          });

          // Finally, reduce to a single value
          return result.reduce(reducerFn, initialValue);
        };
      };
    }
  };
}

// USAGE:
// const pipeline = createPipeline();
// const totalPrice = pipeline
//   .filter(item => item.price > 20)    // Keep expensive items
//   .map(item => item.price)            // Extract prices
//   .reduce((sum, price) => sum + price)(0);  // Sum them, starting from 0
// const result = totalPrice(cartItems);


/**
 * ============================================================================
 * EXAMPLE 6: DECORATOR PATTERN
 * ============================================================================
 *
 * WHAT THIS DOES:
 * "Decorates" functions by wrapping them with additional behavior.
 * The original function still works the same, but now it also logs,
 * times, caches, validates, etc.
 *
 * WHY IT'S A HOF:
 * It takes a function and returns a NEW function (with added behavior).
 *
 * REAL-WORLD ANALOGY:
 * Like wrapping a gift: the gift is still there, but now it has
 * wrapping paper, a bow, and a card (extra features).
 */
function withLogging(originalFn) {
  // This is a decorator - it wraps a function with logging

  return function(...args) {
    // This is the new function that wraps the original
    // '...args' means "accept any number of arguments"

    console.log(`Calling function with args:`, args);
    const result = originalFn(...args);  // Call original function
    console.log(`Result:`, result);
    return result;  // Return the result unchanged
  };
}

function withTiming(originalFn) {
  // Another decorator - wraps with timing information

  return function(...args) {
    const start = Date.now();  // Record start time
    const result = originalFn(...args);  // Call original
    const duration = Date.now() - start;  // Calculate duration
    console.log(`Function took ${duration}ms`);
    return result;
  };
}

// Combining decorators (nested HOFs)
function applyDecorators(...decorators) {
  // This takes multiple decorators and applies them all
  // ...decorators collects all decorator functions into an array

  return function(fn) {
    // This function takes the original function to decorate

    // reduceRight applies decorators from right to left
    // This means the last decorator in the list wraps the function first
    // Then the second-to-last wraps that, etc.
    // Final result: decorator1(decorator2(decorator3(fn)))
    return decorators.reduceRight((decorated, decorator) => {
      return decorator(decorated);  // Wrap the already-decorated function
    }, fn);  // Start with the original function
  };
}

// USAGE:
// const add = (a, b) => a + b;
// const decoratedAdd = applyDecorators(withLogging, withTiming)(add);
// decoratedAdd(2, 3);
//
// This will:
// 1. Time how long it takes
// 2. Log the arguments and result
// 3. Actually add the numbers
//
// All while the original 'add' function stays unchanged!


/**
 * ============================================================================
 * EXAMPLE 7: PARTIAL APPLICATION
 * ============================================================================
 *
 * WHAT THIS DOES:
 * Pre-fills some arguments of a function, creating a new function that
 * needs fewer arguments. This is called "partial application."
 *
 * EXAMPLE:
 * If you have: multiply(a, b, c) = a * b * c
 * And you know 'a' will always be 2, you can create:
 * multiplyBy2(b, c) = 2 * b * c
 *
 * WHY IT'S NESTED:
 * We nest 3 levels because we're pre-filling arguments in stages.
 * Level 1: Pre-fill first arguments
 * Level 2: Pre-fill second arguments
 * Level 3: Provide final arguments and execute
 */
function partial(fn, ...firstArgs) {
  // 'fn' is the original function
  // '...firstArgs' are the arguments we want to pre-fill

  return function(...secondArgs) {
    // This function accepts the next set of arguments

    return function(...thirdArgs) {
      // This function accepts the final arguments
      // Now we have all arguments: firstArgs + secondArgs + thirdArgs
      return fn(...firstArgs, ...secondArgs, ...thirdArgs);
      // Spread operator (...) expands arrays into individual arguments
    };
  };
}

// USAGE:
// const multiply = (a, b, c) => a * b * c;
//
// Step 1: Pre-fill 'a' with 2
//   const partialMultiply = partial(multiply, 2);
//   Now partialMultiply is: (b, c) => 2 * b * c
//
// Step 2: Pre-fill 'b' with 3
//   const partialMultiply2 = partialMultiply(3);
//   Now partialMultiply2 is: (c) => 2 * 3 * c
//
// Step 3: Provide final argument
//   const result = partialMultiply2(4);  // 2 * 3 * 4 = 24
//
// This is useful when you know some arguments ahead of time!


/**
 * ============================================================================
 * EXAMPLE 8: CURRYING
 * ============================================================================
 *
 * WHAT IS CURRYING?
 * Converting a function that takes multiple arguments into a series of
 * functions that each take a single argument.
 *
 * EXAMPLE:
 * Instead of: add(a, b, c)
 * You get: add(a)(b)(c)
 *
 * DIFFERENCE FROM PARTIAL APPLICATION:
 * - Partial: You can provide multiple args at once: partial(fn, 1, 2)(3)
 * - Curry: You provide one arg at a time: curry(fn)(1)(2)(3)
 *
 * WHY IT'S USEFUL:
 * Allows you to create specialized functions by "pre-filling" arguments
 * one at a time, creating intermediate functions you can reuse.
 */
function curry(fn) {
  // 'fn' is the function we want to curry

  return function curried(...args) {
    // This is the curried version of the function
    // '...args' collects all arguments provided so far

    // Check if we have enough arguments
    if (args.length >= fn.length) {
      // fn.length tells us how many arguments the original function expects
      // If we have enough, call the original function
      return fn(...args);
    } else {
      // If not enough arguments, return a function that accepts more
      return function(...nextArgs) {
        // Combine previous args with new args and call curried again
        // This creates the "chain" of function calls
        return curried(...args, ...nextArgs);
      };
    }
  };
}

// USAGE:
// const add = (a, b, c) => a + b + c;
// const curriedAdd = curry(add);
//
// You can now call it in multiple ways:
//   curriedAdd(1)(2)(3)        // One arg at a time: 6
//   curriedAdd(1, 2)(3)        // Some args together: 6
//   curriedAdd(1)(2, 3)        // Some args together: 6
//
// Or create specialized functions:
//   const addOne = curriedAdd(1);           // Adds 1 to two numbers
//   const addOneTwo = addOne(2);            // Adds 3 to one number
//   const result = addOneTwo(3);            // 1 + 2 + 3 = 6
//
// This is extremely powerful for creating reusable function components!


/**
 * ============================================================================
 * EXAMPLE 9: MEMOIZATION
 * ============================================================================
 *
 * WHAT IS MEMOIZATION?
 * Caching the results of expensive function calls. If you call a function
 * with the same arguments twice, it returns the cached result instead of
 * recalculating.
 *
 * WHY IT'S A HOF:
 * It takes a function and returns a NEW function with caching behavior.
 * The original function is "wrapped" with caching logic.
 *
 * WHEN TO USE:
 * - Expensive calculations (recursion, loops, API calls)
 * - Pure functions (same input always gives same output)
 * - Functions called repeatedly with same arguments
 */
function memoize(fn) {
  const cache = new Map();  // Store results: arguments → result
  // Map is like an object, but can use any type as key

  return function(...args) {
    // This is the memoized version of the function

    // Create a key from the arguments
    // JSON.stringify converts arguments to a string we can use as a key
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      // If we've seen these arguments before, return cached result
      return cache.get(key);
    }

    // Otherwise, call the original function
    const result = fn(...args);

    // Store the result in cache for next time
    cache.set(key, result);

    return result;
  };
}

// Combining memoization with other HOFs
function memoizedAndLogged(fn) {
  // This shows how HOFs can be composed!
  // First we memoize, then we add logging

  const memoized = memoize(fn);  // Add caching
  return withLogging(memoized);   // Add logging
  // Result: a function that's both cached AND logged
}

// USAGE:
// const expensiveCalculation = (n) => {
//   console.log('Calculating...');
//   return n * n * n;  // Expensive operation
// };
//
// const memoized = memoize(expensiveCalculation);
// memoized(5);  // Calculates, stores result
// memoized(5);  // Returns cached result instantly!
// memoized(3);  // Calculates new result for 3
// memoized(5);  // Returns cached result for 5 again


/**
 * ============================================================================
 * EXAMPLE 10: SHOPPING CART SPECIFIC - NESTED RULE BUILDER
 * ============================================================================
 *
 * WHAT THIS DOES:
 * Creates a specialized rule builder for shopping cart discounts.
 * It's a factory that creates discount rules based on product code,
 * minimum quantity, and discount calculation.
 *
 * WHY IT'S NESTED 4 LEVELS:
 * Level 1: Create the builder (no config)
 * Level 2: Specify which product (productCode)
 * Level 3: Specify minimum quantity threshold
 * Level 4: Specify how to calculate the discount
 * Level 5: Actually apply to items
 *
 * REAL-WORLD USE:
 * This is exactly what you'd use in a shopping cart system!
 * You can create rules like:
 * - "For product 'ult_small', if quantity >= 3, apply 3-for-2 discount"
 * - "For product 'ult_large', if quantity > 3, drop price to $39.90"
 */
function createCartRuleBuilder() {
  // LEVEL 1: Start building a rule

  return function(productCode) {
    // LEVEL 2: Specify which product this rule applies to
    // Example: 'ult_small', 'ult_large', etc.

    return function(quantity) {
      // LEVEL 3: Specify minimum quantity required
      // Example: 3 (rule applies when you buy 3 or more)

      return function(discountFn) {
        // LEVEL 4: Specify HOW to calculate the discount
        // discountFn is a function that takes matching items and returns discount info
        // Example: (items) => ({ discount: Math.floor(items.length / 3) * 24.90 })

        return function(items) {
          // LEVEL 5: Actually execute the rule

          // Find all items matching the product code
          const matchingItems = items.filter(item => item.code === productCode);

          // Check if we meet the quantity threshold
          if (matchingItems.length >= quantity) {
            // If yes, calculate and return the discount
            return discountFn(matchingItems);
          }

          // If no, return no discount
          return { discount: 0, addItems: [] };
        };
      };
    };
  };
}

// USAGE BREAKDOWN:
//
// Step 1: Create a builder
//   const ruleBuilder = createCartRuleBuilder();
//
// Step 2: Specify product
//   const smallRule = ruleBuilder('ult_small');
//
// Step 3: Specify quantity threshold
//   const threeForTwo = smallRule(3);
//
// Step 4: Specify discount calculation
//   const threeForTwoRule = threeForTwo((items) => ({
//     discount: Math.floor(items.length / 3) * 24.90
//   }));
//   This says: "For every 3 items, discount 1 item's price"
//
// Step 5: Apply to cart
//   const result = threeForTwoRule(cartItems);
//
// OR, chain it all:
//   const result = createCartRuleBuilder()('ult_small')(3)((items) => ({
//     discount: Math.floor(items.length / 3) * 24.90
//   }))(cartItems);
//
// This creates a reusable, composable discount system!


// ============================================================================
// KEY TAKEAWAYS FOR BECOMING AN HOF EXPERT
// ============================================================================
//
// 1. **Closures are Key**: Inner functions remember outer variables.
//    This is what makes HOFs powerful - they can "remember" configuration.
//
// 2. **Functions are Values**: You can pass functions around, store them,
//    return them, just like any other data type.
//
// 3. **Composition over Repetition**: Instead of writing similar functions,
//    create one HOF that accepts different behaviors.
//
// 4. **Partial Application**: Pre-fill some arguments to create specialized
//    versions of functions.
//
// 5. **Currying**: Convert multi-arg functions into chains of single-arg
//    functions for maximum flexibility.
//
// 6. **Decorators**: Wrap functions to add cross-cutting concerns (logging,
//    caching, validation) without modifying the original.
//
// 7. **Builders**: Use fluent APIs and nested HOFs to build complex
//    configurations declaratively.
//
// 8. **Practice**: Try modifying these examples, combine them, create your own.
//    The more you practice, the more natural HOFs become!
//
// ============================================================================

// Export examples for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createDiscountApplicator,
    createPricingRuleBuilder,
    compose,
    createRuleChain,
    createPipeline,
    withLogging,
    withTiming,
    applyDecorators,
    partial,
    curry,
    memoize,
    memoizedAndLogged,
    createCartRuleBuilder
  };
}
