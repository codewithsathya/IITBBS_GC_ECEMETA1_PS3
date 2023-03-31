import { Button } from "@material-tailwind/react/components/Button"
import ComplexNavbar from "../components/ComplexNavbar"

export default function Home(){
    return (
        <div>
            <ComplexNavbar />
            <div id="home" className="h-[70vh] text-center">
                <div className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-center p-2">
                    <div>
                    {/* <p className="text-sm uppercase tracking-widest text-gray-600 dark:text-gray-100">
                        Experience seamless video meetings, without spending a penny
                    </p> */}
                    <h1 className="text-3xl font-extrabold leading-9 text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                        Experience seamless video meetings, without spending a penny
                    </h1>
                    <Button className="my-4 leading-6 font-semibold text-md">Create a meeting</Button>
                    {/* <p className="m-auto max-w-[70%] py-4 text-lg leading-7 text-gray-500 dark:text-gray-400">
                        I&apos;m a full-stack web developer studying in IIT Bhubaneswar, India. I love
                        programming, reading tech blogs and learning new technologies.
                    </p> */}
                    </div>
                </div>
            </div>
        </div>
    )
}