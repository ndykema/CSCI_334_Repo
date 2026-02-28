
import "./Home.css";
import Image1 from '../assets/FarmlandSecurity.png';
import Image2 from '../assets/FarmerChoice.png';
import Image3 from '../assets/Siloimage.png';
import Image4 from '../assets/TheFarmory.png';
import Image5 from '../assets/ClaimingPastures.png';
import Create from "./Create"; 
import { Link } from "react-router-dom";


function Home() {

   

   
    return ( 
        <div className="home-container">
            <h1>Welcome to Farmageddon Fields!</h1>
       

            <div className="description-one">
                <div className="description-one-left">
        <p>Dive into a world of endless agricultural possibilities, where you can cultivate your own virtual farm, grow a variety of crops, and raise adorable animals.
        Whether you're a seasoned farmer or just starting out, Farmageddon Fields offers a fun and immersive way to connect with nature and enjoy the joys of farming.
        Get ready to sow, harvest, and thrive in this vibrant farming adventure!
                        Discover the ultimate farming experience with Farmageddon Fields!</p>
                </div>
                <div className="description-one-right">
                    <img src={Image1} alt="HomePageImage3" className="description-one-image"></img>
                </div>
            </div>


            <div className="description-two">
                <div className="description-two-left">
                    <img src={Image2} alt="HomePageImage2" className="description-two-image"></img>


                </div>
                <div className="description-two-right">
                    <p>Farmageddon Fields is a game that combines the joys of farming with the excitement of strategy and competition.
                        Once you've created an account, pick your <s>farmer</s> general and start your farming journey by planting crops, tending to your animals, and expanding your farm.
                        </p>
                    <p>
                        Build, stockpile, and battle your way to becoming the ultimate farmer in this unique and engaging farming game.
                        When your farm gets big enough, take your animals to war to fight for larger pastures and defeat other farmers in the local area.</p>
                </div>
            </div>

            <div className="description-three">
                <div className="description-three-left">
                    <img src={Image3} alt="HomePageImage3" className="description-three-image"></img>
                <p> Build silos to store resources, both feed for your animals, but also for missles to sabatoge your enemies.</p>
                </div>
                <div className="description-three-right">
                    <img src={Image4} alt="HomePageImage4" className="description-three-image"></img>
                    <p>Be sure to visit the Farmory and keep a good stock on hand. A good arsenal is key to keeping your animals ready to attack. </p>
                </div>
            </div>

            <div className="description-four">
                <div className="description-four-left">
                    <p>Strategize your attacks and defend your farm from rival farmers.
                        Use your resources wisely to outsmart your opponents and claim victory in the competitive farming arena.
                        Claim the pastures you and your animals deserve!
                    </p>
                </div>
                <div className="description-four-right">
                    <img src={Image5} alt="HomePageImage5" className="description-four-image"></img>
                </div>
            </div>

            <div className="description-five">
                <p>Farmageddon Fields is not just a game, it's a community.
                    Connect with fellow farmers, share your progress, and compete in exciting events and challenges.
                    Join the Farmageddon Fields community today and experience the thrill of farming like never before! What are you waiting for? Sign up now!
                </p>

                <ul><li><Link to="/account">Create An Account </Link></li></ul>
            </div>

        </div >


    
        );
  
}

export default Home;
