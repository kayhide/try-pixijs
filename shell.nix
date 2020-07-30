{ nixpkgs ? import <nixpkgs> {}
}:

let
  inherit (nixpkgs) pkgs;

in

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs-13_x
    yarn
  ];
}
