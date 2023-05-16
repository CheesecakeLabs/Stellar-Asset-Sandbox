package entity

type ProducerInterface interface {
	Produce(string, string, interface{}) error
}
