export const languages = {
  java: {
    name: "Java",
    short: "Jv",
    extension: "java",
    monaco: "java",
    color: "#e77d42",
    description: "从 main 方法开始，让想法成为程序。",
    sample:
      'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, playground!");\n  }\n}\n',
  },
  python: {
    name: "Python",
    short: "Py",
    extension: "py",
    monaco: "python",
    color: "#518dca",
    description: "少写一些样板，多试一个想法。",
    sample:
      'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("playground"))\n',
  },
  go: {
    name: "Go",
    short: "Go",
    extension: "go",
    monaco: "go",
    color: "#39acc0",
    description: "把一个小实验快速跑起来。",
    sample:
      'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, playground!")\n}\n',
  },
  javascript: {
    name: "JavaScript",
    short: "JS",
    extension: "js",
    monaco: "javascript",
    color: "#edc85a",
    description: "在服务端运行一段 JavaScript。",
    sample: 'const greeting = "Hello, playground!";\nconsole.log(greeting);\n',
  },
  node: {
    name: "Node.js",
    short: "N",
    extension: "js",
    monaco: "javascript",
    color: "#80b86d",
    description: "用 Node.js 试验脚本和标准库。",
    sample:
      'const os = require("node:os");\nconsole.log(`Hello from ${os.platform()}!`);\n',
  },
  sql: {
    name: "SQLite",
    short: "DB",
    extension: "sql",
    monaco: "sql",
    color: "#ad92dd",
    description: "在独立的内存数据库里验证 SQL。",
    sample:
      'CREATE TABLE people (name TEXT, role TEXT);\nINSERT INTO people VALUES ("Ada", "Engineer"), ("Lin", "Designer");\nSELECT * FROM people;\n',
  },
} as const;

export type Language = keyof typeof languages;
export const languageIds = Object.keys(languages) as Language[];

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && Object.hasOwn(languages, value);
}
