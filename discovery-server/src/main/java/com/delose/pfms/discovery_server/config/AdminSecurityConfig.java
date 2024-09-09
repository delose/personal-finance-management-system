@Configuration
public static class AdminSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) {
        http
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.NEVER).and()
            .httpBasic().disable()
            .authorizeRequests()
            .antMatchers(HttpMethod.GET, "/").hasRole("ADMIN")
            .antMatchers("/info", "/health").authenticated()
            .anyRequest().denyAll().and()
            .csrf().disable();
    }
}