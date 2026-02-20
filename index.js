import readline from "readline";
import crypto from "crypto";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let proposals = [];

function header() {
  console.clear();
  console.log("DAO-ENGVOT // CONSTITUTIONAL VOTING ENGINE");
  console.log("══════════════════════════════════════════════");
  console.log("");
}

function render() {
  header();

  if (proposals.length === 0) {
    console.log("No proposals yet.\n");
  }

  proposals.forEach(p => {
    const total = p.yes + p.no;
    const yesPct = total ? ((p.yes / total) * 100).toFixed(1) : "0.0";
    const noPct = total ? ((p.no / total) * 100).toFixed(1) : "0.0";

    console.log(`ID: ${p.id}`);
    console.log(`Title: ${p.title}`);
    console.log(`Status: ${p.status}`);
    console.log(`YES: ${p.yes} (${yesPct}%)`);
    console.log(`NO : ${p.no} (${noPct}%)`);
    console.log("────────────────────────────────────────────");
  });

  console.log("");
  console.log("COMMANDS");
  console.log("────────────");
  console.log("propose");
  console.log("vote");
  console.log("finalize");
  console.log("list");
  console.log("exit");
  console.log("");
}

function prompt() {
  rl.question("dao> ", handle);
}

function propose() {
  rl.question("Proposal Title: ", (title) => {
    const id = crypto.randomBytes(3).toString("hex");
    proposals.push({
      id,
      title,
      yes: 0,
      no: 0,
      status: "ACTIVE"
    });
    render();
    prompt();
  });
}

function vote() {
  rl.question("Proposal ID: ", (id) => {
    const prop = proposals.find(p => p.id === id);

    if (!prop || prop.status !== "ACTIVE") {
      console.log("Invalid or finalized proposal\n");
      return prompt();
    }

    rl.question("Vote (yes/no): ", (v) => {
      if (v === "yes") prop.yes++;
      if (v === "no") prop.no++;
      render();
      prompt();
    });
  });
}

function finalize() {
  rl.question("Proposal ID: ", (id) => {
    const prop = proposals.find(p => p.id === id);

    if (!prop || prop.status !== "ACTIVE") {
      console.log("Invalid proposal\n");
      return prompt();
    }

    prop.status = prop.yes > prop.no ? "APPROVED" : "REJECTED";
    render();
    prompt();
  });
}

function handle(cmd) {
  switch (cmd.trim()) {
    case "propose":
      propose();
      break;
    case "vote":
      vote();
      break;
    case "finalize":
      finalize();
      break;
    case "list":
      render();
      prompt();
      break;
    case "exit":
      console.log("DAO Engine Shutdown");
      rl.close();
      break;
    default:
      render();
      prompt();
  }
}

render();
prompt();
