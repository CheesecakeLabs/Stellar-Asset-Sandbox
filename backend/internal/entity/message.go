package entity

type ParserInput struct {
}

type NotifyData struct {
	Key         string
	ParserInput ParserInput
	Producer    ProducerInterface
}
