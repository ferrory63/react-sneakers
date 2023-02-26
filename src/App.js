import React from 'react'
import axios from 'axios'
import Header from './components/Header'
import Drawer from './components/Drawer/index.js'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Favorites from './pages/Favorites'
import Orders from './pages/orders'

export const AppContext = React.createContext({})

function App() {
    const [items, setItems] = React.useState([])
    const [cartItems, setCartItems] = React.useState([])
    const [cartOpened, setCartOpened] = React.useState(false)
    const [favorites, setFavorites] = React.useState([])
    const [searchValue, setSearchValue] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        async function fetchData() {
            const cartResponse = await axios.get(
                'https://6272467725fed8fcb5f1a506.mockapi.io/cart'
            )

            const favoritesResponse = await axios.get(
                'https://6272467725fed8fcb5f1a506.mockapi.io/Favorites'
            )
            const itemsResponse = await axios.get(
                'https://6272467725fed8fcb5f1a506.mockapi.io/items'
            )

            setIsLoading(false)

            setCartItems(cartResponse.data)
            setFavorites(favoritesResponse.data)
            setItems(itemsResponse.data)
        }

        fetchData()
    }, [])

    const onAddToCart = (obj) => {
        if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
            axios.delete(
                `https://6272467725fed8fcb5f1a506.mockapi.io/cart/${obj.id}`
            )
            setCartItems((prev) =>
                prev.filter((item) => Number(item.id) !== Number(obj.id))
            )
        } else {
            axios.post('https://6272467725fed8fcb5f1a506.mockapi.io/cart', obj)
            setCartItems((prev) => [...prev, obj])
        }
        //catch(error) {alert('Не удалось добавить в корзину')}
        //setCartItems((prev) => [...prev, obj]);
        //axios.post('https://6272467725fed8fcb5f1a506.mockapi.io/cart', obj);
    }

    const onRemoveItem = (id) => {
        //console.log(id)
        //setCartItems((prev) => [...prev, obj]);
        axios.delete(`https://6272467725fed8fcb5f1a506.mockapi.io/cart/${id}`)
        setCartItems((prev) => prev.filter((item) => item.id !== id))
    }

    const onAddToFavorite = async (obj) => {
        try {
            if (
                favorites.find((favobj) => Number(favobj.id) === Number(obj.id))
            ) {
                axios.delete(
                    `https://6272467725fed8fcb5f1a506.mockapi.io/Favorites/${obj.id}`
                )
                setFavorites((prev) =>
                    prev.filter((item) => Number(item.id) !== obj.id)
                )
            } else {
                const { data } = await axios.post(
                    'https://6272467725fed8fcb5f1a506.mockapi.io/Favorites',
                    obj
                )
                setFavorites((prev) => [...prev, data])
            }
        } catch (error) {
            alert('Не удалось добавить в фавориты')
        }
    }

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value)
    }

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.id) === Number(id))
    }

    return (
        <AppContext.Provider
            value={{
                items,
                cartItems,
                favorites,
                isItemAdded,
                onAddToFavorite,
                setCartOpened,
                setCartItems,
                onAddToCart,
            }}
        >
            <div className="wrapper clear">
                <Drawer
                    items={cartItems}
                    onRemove={onRemoveItem}
                    onClose={() => setCartOpened(false)}
                    opened={cartOpened}
                />

                <Header onClickCart={() => setCartOpened(true)} />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                items={items}
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                onChangeSearchInput={onChangeSearchInput}
                                onAddToCart={onAddToCart}
                                cartItems={cartItems}
                                isLoading={isLoading}
                            />
                        }
                    />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/orders" element={<Orders />} />
                </Routes>
            </div>
        </AppContext.Provider>
    )
}

export default App
