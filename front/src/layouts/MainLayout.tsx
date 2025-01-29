import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <>
      <Sidebar /> 
      <main className="lg:ml-72 p-4 pt-8 bg-gray-100 min-h-screen">
        <Outlet /> 
      </main>
    </>
  );
}
