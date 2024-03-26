import readline from "readline";
import { clearTerminal, askToContinue, getStringFromUser } from "./utils/terminal.js";
import { searchGoogleMaps } from "./service/googleMaps.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  while (true) {
    const stringFromUser = await getStringFromUser(rl);
    await searchGoogleMaps(stringFromUser);
    const answer = await askToContinue(rl);
    if (!answer) {
      console.log("Program berakhir...");
      break;
    }
    clearTerminal();
  }
}

main()
  .then(() => {
    rl.close();
  })
  .catch((error) => {
    console.error("Error in main function:", error);
    rl.close();
  });
