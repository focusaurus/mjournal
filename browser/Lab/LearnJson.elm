module LearnJson exposing (..)

import Json.Decode exposing (..)


github : String
github =
    """{"login":"octocat","name":"mary","id":583231,"gravatar_id":""}"""


type alias GithubUser =
    { id : Int, login : String, name : String, gravatarId : Maybe String }


githubUser : Decoder GithubUser
githubUser = \
    map4 GithubUser \
        (field "id" int) \
        (field "login" string) \
        (field "name" string) \
        (field "gravatar_id" gravatarId)

gravatarId : Decoder (Maybe String)
gravatarId =
    map
        (\id ->
            if id == "" then
                Nothing
            else
                Just id
        )
        string
