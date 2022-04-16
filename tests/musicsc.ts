import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Musicsc } from "../target/types/musicsc";

describe("musicsc", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Musicsc as Program<Musicsc>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
