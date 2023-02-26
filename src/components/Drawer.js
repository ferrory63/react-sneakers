import axios from 'axios'
import React from 'react'
import { useCart } from '../hooks/useCart'

import Info from './info'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function Drawer({ onClose, onRemove, items = [], opened }) {
    const { cartItems, setCartItems, totalPrice } = useCart()
    const [orderId, setOrderId] = React.useState(null)
    const [isOrderComplete, setIsOrderComplete] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const onClickOrder = async () => {
        setIsLoading(true)
        const { data } = await axios.post(
            'https://6272467725fed8fcb5f1a506.mockapi.io/Orders',
            { items: cartItems }
        )
        setIsOrderComplete(true)
        setOrderId(data.id)

        setCartItems([])
        setIsLoading(false)
        await axios.put('https://6272467725fed8fcb5f1a506.mockapi.io/cart', [])

        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i]
            await axios.delete(
                `https://6272467725fed8fcb5f1a506.mockapi.io/cart/` + item.id
            )
            await delay(1000)
        }
    }

    return (
        <div className="overlay">
            <div className="drawer">
                <h2 className="d-flex justify-between mb-30">
                    Корзина{' '}
                    <img
                        onClick={onClose}
                        className="cu-p"
                        src="/img/btn-remove.svg"
                        alt="Close"
                    />
                </h2>

                {items.length > 0 ? (
                    <div className="d-flex flex-column">
                        <div className="items">
                            {items.map((obj) => (
                                <div
                                    key={obj.id}
                                    className="cartItem d-flex align-center mb-20"
                                >
                                    <div
                                        style={{
                                            backgroundImage: `url(${obj.imageUrl})`,
                                        }}
                                        className="cartItemImg"
                                    ></div>

                                    <div className="mr-20 flex">
                                        <p className="mb-5">{obj.title}</p>
                                        <b>{obj.price} руб.</b>
                                    </div>
                                    <img
                                        onClick={() => onRemove(obj.id)}
                                        className="removeBtn"
                                        src="/img/btn-remove.svg"
                                        alt="Remove"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="cartTotalBlock">
                            <ul>
                                <li>
                                    <span>Итого:</span>
                                    <div></div>
                                    <b>{totalPrice} руб. </b>
                                </li>
                                <li>
                                    <span>Налог 5%:</span>
                                    <div></div>
                                    <b>{totalPrice * 0.05} руб. </b>
                                </li>
                            </ul>
                            <button
                                className="greenButton"
                                onClick={onClickOrder}
                                disabled={isLoading}
                            >
                                Оформить заказ
                                <img src="/img/arrow.svg" alt="Arrow" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <Info
                        title={
                            isOrderComplete
                                ? 'Заказ оформлен!'
                                : 'Корзина пустая'
                        }
                        image={
                            isOrderComplete
                                ? '/img/complete-order.jpg'
                                : '/img/cart-empty.jpg'
                        }
                        description={
                            isOrderComplete
                                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                                : 'Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.'
                        }
                    />
                )}
            </div>
        </div>
    )
}

export default Drawer
