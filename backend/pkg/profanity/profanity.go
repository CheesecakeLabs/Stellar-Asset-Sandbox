package profanity

import (
	goaway "github.com/TwiN/go-away"
)

type ProfanityFilter struct{}

func (pf *ProfanityFilter) ContainsProfanity(input string) bool {
	return goaway.IsProfane(input)
}

func (pf *ProfanityFilter) ReplaceProfanity(input string) string {
	return goaway.Censor(input)
}
