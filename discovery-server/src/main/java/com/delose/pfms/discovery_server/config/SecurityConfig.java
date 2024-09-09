@Configuration
@EnableWebSecurity
@Order(1)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) {
        auth.inMemoryAuthentication()
        .withUser("discUser")
        .password("discPassword")
        .roles("SYSTEM");
    }
    @Override
    protected void configure(HttpSecurity http) {
        http
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.ALWAYS).and()
            .requestMatchers().antMatchers("/eureka/**").and()
            .authorizeRequests()
            .antMatchers("/eureka/**").hasRole("SYSTEM")
            .anyRequest().denyAll().and()
            .httpBasic().and()
            .csrf().disable();
    }
}