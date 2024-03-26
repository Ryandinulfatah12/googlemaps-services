import { clear } from "console";

export function clearTerminal() {
  // Clear terminal
  clear();
  // Move cursor to top
  process.stdout.write("\u001b[H\u001b[2J");
}

export async function askToContinue(rl) {
  return new Promise((resolve, reject) => {
    rl.question(
      "Apakah Anda ingin melakukan pencarian lagi? (y/n): ",
      (answer) => {
        resolve(answer.toLowerCase() === "y");
      }
    );
  });
}

export function getStringFromUser(rl) {
    return new Promise((resolve, reject) => {
      rl.question(
        "📌 Masukan keyword yang ingin kamu ambil datanya: ",
        (answer) => {
          resolve(answer);
        }
      );
    });
  }