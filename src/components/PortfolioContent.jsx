import { RouterProvider } from 'react-router-dom';
import { router } from '../routes/router.jsx';

export default function PortfolioContent() {
    return (
        <header className="fixed text-white z-10 left-14 top-12 mix-blend-difference">
            <h1 className="font-extralight text-3xl h-[30px] ">
                Sai Barath
            </h1>
            <p className="font-extralight mt-1 ml-[1px]">
                RND Software Engineer
            </p>
            <RouterProvider router={router} />
        </header>
    )
}