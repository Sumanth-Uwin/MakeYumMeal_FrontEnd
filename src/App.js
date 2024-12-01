import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./pages/Main";
import Signup from "../src/pages/Singup/index";
import Login from "./pages/Login";
import RecipeDetail from "./pages/RecipeDetails/RecipeDetail";
import SearchRecipes from "./pages/SearchRecipes/SearchRecipes";
import CategoryPage from './pages/category/CategoryPage';
import ShoppingList from "./pages/shoppingList/ShoppingList";

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{/* Protected Routes */}
			{user ? (
				<>
					<Route path="/" element={<Main />} />
					<Route path="/home" element={<Main />} />
					<Route path="/search" element={<SearchRecipes />} />
					<Route path="/cart" element={<ShoppingList />} />
					<Route path="/recipe/:id" element={<RecipeDetail />} />
				</>
			) : (
				<Route path="/" element={<Navigate replace to="/login" />} />
			)}

			{/* Public Routes */}
			<Route path="/signup" element={<Signup />} />
			<Route path="/login" element={<Login />} />
			<Route path="/categories/:category" element={<CategoryPage />} />

			{/* Catch-all Redirect for Unauthorized Access */}
			<Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
		</Routes>
	);
}

export default App;
