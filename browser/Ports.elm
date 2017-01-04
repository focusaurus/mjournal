port module Ports exposing (..)


port clearNewEntryBody : () -> Cmd msg


port clickDocument : (Bool -> msg) -> Sub msg


port setTheme : String -> Cmd msg
