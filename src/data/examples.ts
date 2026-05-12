export interface Example {
  id: number
  title: string
  category: string
  description: string
  code: string
}

export const examples: Example[] = [
  {
    id: 1,
    title: 'Hello World',
    category: 'Basics',
    description: 'The classic first program in Akro.',
    code: `fn main {
  say "Hello, World!"
}`,
  },
  {
    id: 2,
    title: 'Variables & Types',
    category: 'Basics',
    description: 'Declaring variables with type inference.',
    code: `fn main {
  name := "Akro"
  version := 0.1
  is_fast := true
  say "Language: {name}"
  say "Version: {version}"
  say "Fast: {is_fast}"
}`,
  },
  {
    id: 3,
    title: 'Functions',
    category: 'Basics',
    description: 'Defining and calling functions.',
    code: `fn greet(name) {
  return "Hello, {name}!"
}

fn add(a, b) {
  return a + b
}

fn main {
  msg := greet("World")
  say msg
  say add(3, 4)
}`,
  },
  {
    id: 4,
    title: 'Fibonacci',
    category: 'Algorithms',
    description: 'Recursive Fibonacci sequence.',
    code: `fn fib(n) {
  if n <= 1 {
    return n
  }
  return fib(n - 1) + fib(n - 2)
}

fn main {
  for i in 0..10 {
    say fib(i)
  }
}`,
  },
  {
    id: 5,
    title: 'Calculator',
    category: 'Basics',
    description: 'Simple arithmetic calculator.',
    code: `fn calculate(a, op, b) {
  match op {
    case "+" { return a + b }
    case "-" { return a - b }
    case "*" { return a * b }
    case "/" {
      if b == 0 { return "Error: division by zero" }
      return a / b
    }
    case _ { return "Unknown operator" }
  }
}

fn main {
  say calculate(10, "+", 5)
  say calculate(10, "-", 3)
  say calculate(4, "*", 7)
  say calculate(20, "/", 4)
}`,
  },
  {
    id: 6,
    title: 'Arrays & Maps',
    category: 'Data Structures',
    description: 'Working with arrays and maps.',
    code: `fn main {
  nums := [1, 2, 3, 4, 5]
  doubled := map(nums, fn(x) { return x * 2 })
  say doubled

  scores := { "Alice": 95, "Bob": 87, "Carol": 92 }
  for name, score in scores {
    say "{name}: {score}"
  }
}`,
  },
  {
    id: 7,
    title: 'Structs & Methods',
    category: 'OOP',
    description: 'Defining structs with methods.',
    code: `struct Point {
  x: float
  y: float

  fn distance(other) {
    dx := self.x - other.x
    dy := self.y - other.y
    return sqrt(dx*dx + dy*dy)
  }

  fn to_string() {
    return "({self.x}, {self.y})"
  }
}

fn main {
  p1 := Point { x: 0.0, y: 0.0 }
  p2 := Point { x: 3.0, y: 4.0 }
  say p1.distance(p2)
  say p2.to_string()
}`,
  },
  {
    id: 8,
    title: 'Pattern Matching',
    category: 'Control Flow',
    description: 'Using match expressions.',
    code: `fn describe(val) {
  match val {
    case 0       { return "zero" }
    case 1..10   { return "small" }
    case 11..100 { return "medium" }
    case _       { return "large" }
  }
}

fn main {
  say describe(0)
  say describe(5)
  say describe(42)
  say describe(999)
}`,
  },
  {
    id: 9,
    title: 'Error Handling',
    category: 'Advanced',
    description: 'Handling errors with try/catch.',
    code: `fn divide(a, b) {
  if b == 0 {
    throw "DivisionByZero: cannot divide by zero"
  }
  return a / b
}

fn main {
  try {
    result := divide(10, 2)
    say "10 / 2 = {result}"
    bad := divide(5, 0)
    say bad
  } catch err {
    say "Caught error: {err}"
  }
}`,
  },
  {
    id: 10,
    title: 'Guessing Game',
    category: 'Games',
    description: 'A number guessing game.',
    code: `fn main {
  secret := rand(1, 100)
  attempts := 0

  say "Guess a number between 1 and 100!"

  while true {
    guess := input("Your guess: ")
    attempts = attempts + 1

    if guess < secret {
      say "Too low! Try again."
    } elif guess > secret {
      say "Too high! Try again."
    } else {
      say "Correct! You got it in {attempts} attempts!"
      break
    }
  }
}`,
  },
]
