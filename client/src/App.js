import { Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/register';
import DetailPage from './pages/DetailPage';
import Payment from './pages/Payment';
import { MyPage } from './pages/MyPage';
import Farm from './pages/Farm';
import FarmReservation from './pages/FarmReservation';
import FarmTimeTable from './pages/FarmTimeTable';
import MyReservation from './pages/MyReservation';
import Favorite from './pages/Favorite';
import NotFound from './pages/NotFound';
import {
	NonMemberRoute,
	MemberRoute,
	FarmerRoute,
} from './components/RestrictionRoute';

function App() {
	return (
		<div className="App">
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route
						path="/login"
						element={
							<NonMemberRoute>
								<Login />
							</NonMemberRoute>
						}
					/>
					<Route
						path="/register"
						element={
							<NonMemberRoute>
								<Register />
							</NonMemberRoute>
						}
					/>
					<Route path="/detail/:id" element={<DetailPage />} />
					<Route
						path="/pay"
						element={
							<MemberRoute>
								<Payment />
							</MemberRoute>
						}
					/>
					<Route
						path="/mypage"
						element={
							<MemberRoute>
								<MyPage />
							</MemberRoute>
						}
					/>
					<Route
						path="/myreservation"
						element={
							<MemberRoute>
								<MyReservation />
							</MemberRoute>
						}
					/>
					<Route
						path="/favorite"
						element={
							<MemberRoute>
								<Favorite />
							</MemberRoute>
						}
					/>
					<Route
						path="/farm"
						element={
							<FarmerRoute>
								<Farm />
							</FarmerRoute>
						}
					/>
					<Route
						path="/farm/reservation"
						element={
							<FarmerRoute>
								<FarmReservation />
							</FarmerRoute>
						}
					/>
					<Route
						path="/farm/timetable"
						element={
							<FarmerRoute>
								<FarmTimeTable />
							</FarmerRoute>
						}
					/>
					<Route path="/notfound" element={<NotFound />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
