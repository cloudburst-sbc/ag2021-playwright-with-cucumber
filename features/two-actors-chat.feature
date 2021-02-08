# From the 2021 Autmoation Guild session:
#   Set the stage with Playwright and CucumberJS

Feature: Two actors can chat on the app

    In order to communicate
    Two actors chat using the web application

Scenario: ActorA can join chat
    Given ActorA's browser
    When ActorA joins the chat group
    Then ActorA can send a message

Scenario: ActorB can join chat
    Given ActorB's browser
    When ActorB joins the chat group
    Then ActorB can send a message

@wip
Scenario: ActorB can chat with ActorA
    Given ActorA's browser
    And ActorB's browser
    When ActorA joins the chat group
    And ActorB joins the chat group
    Then ActorA can send a message
    And ActorB can send a message
    And ActorB can see ActorA's message
    And ActorA can see ActorB's message

