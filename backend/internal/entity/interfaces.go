package entity

type ProducerInterface interface {
	Produce(string, interface{}) error
}
