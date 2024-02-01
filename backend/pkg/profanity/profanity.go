package profanity

import (
	"strings"
)

var ProfanityList = []string{
	"badword1",
	"badword2",
}

func ContainsProfanity(input string) bool {
	lowerInput := strings.ToLower(input)
	for _, word := range ProfanityList {
		if strings.Contains(lowerInput, word) {
			return true
		}
	}
	return false
}

func ReplaceProfanity(input string) string {
	lowerInput := strings.ToLower(input)
	for _, word := range ProfanityList {
		if strings.Contains(lowerInput, word) {
			replacement := strings.Repeat("*", len(word))
			input = strings.Replace(input, word, replacement, -1)
		}
	}
	return input
}
