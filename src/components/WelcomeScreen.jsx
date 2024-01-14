function WelcomeScreen() {
    return (
        <div className="z-[1000] font-NeueMontreal fixed top-0 left-0 gap-2 w-screen h-screen flex items-center justify-center text-white text-4xl bg-black">
            <p className="fade-out" style={{ animationDelay: '.5s' }}> Sai</p>
            <p className="fade-out" style={{ animationDelay: '0.8s' }}>Barath</p>
            <p className="fade-out font-extralight" style={{ animationDelay: '1.2s' }}>Portfolio</p>
        </div>
    );
}

export default WelcomeScreen;
