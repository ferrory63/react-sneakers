import Card from '../components/Card'
import { AppContext } from '../App'
import React from 'react'
import react from 'react'
import axios from 'axios'

function Orders() {
    const { onAddToCart, onAddToFavorite } = React.useContext(AppContext)
    const [orders, setOrders] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        async function fetchOrders() {
            const { data } = await axios.get(
                'https://6272467725fed8fcb5f1a506.mockapi.io/Orders'
            )
            setOrders(data.reduce((prev, obj) => [...prev, obj.item], []))
            setIsLoading(false)
            console.log(data.reduce((prev, obj) => [...prev, obj.item], []))
        }
        fetchOrders()
    }, [])

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Мои заказы</h1>
            </div>

            <div className="d-flex flex-wrap">
                {(isLoading ? [...Array(10)] : orders).map((item, index) => (
                    <Card key={index} loading={isLoading} {...item} />
                ))}
            </div>
        </div>
    )
}

export default Orders
