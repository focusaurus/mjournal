#!/usr/bin/env bash
repo_root=$(dirname "${0}")/..
command_name=$(basename "$0")
help() {
  echo "mjournal command line interface usage:"
  printf "Basic syntax is ${command_name} <resource-or-subcommand> [options]\n"
  for sub_cli in $(find "${repo_root}/app/" -name cli.js -type f);
  do
    if [ ! -x "${sub_cli}" ]; then
      continue
    fi
    local sub_dir=$(dirname "${sub_cli}")
    local sub_dir=$(basename "${sub_dir}")
    echo "----- ${sub_dir} -----"
    "${sub_cli}" --help
  done
}

unknown() {
  echo "Unknown subcommand ${1}. Run ${0} --help for usage information." 1>&2
  exit 1
}

case "${1}" in
  help|"--help"|"-h"|"")
    help
  ;;
  *)
    SUBSCRIPT="${repo_root}/app/${1}/cli.js"
    if [ -x "${SUBSCRIPT}" ]; then
      shift
      exec "${SUBSCRIPT}" "${@}"
    fi
    #If we get here, an unknown subcommand was used
    unknown "${1}"
  ;;
esac
