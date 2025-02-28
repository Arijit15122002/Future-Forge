import { checkUser } from "@/lib/checkUser";
import ActualHeader from "./header";

const Header = async () => {
    const user = await checkUser()

    return (
        <ActualHeader userExists={!!user} /> 
    )
}

export default Header