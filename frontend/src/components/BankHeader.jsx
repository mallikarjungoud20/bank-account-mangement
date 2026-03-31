function BankHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-20">
        {/* Left: Logo + Bank Name */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏦</span>
          <div>
            <h1 className="text-xl font-bold text-white">My Bank</h1>
            <p className="text-xs text-blue-200">Digital Banking Solutions</p>
          </div>
        </div>

        {/* Right: Navigation Links */}
        <nav className="flex items-center gap-8">
          <a href="#" className="text-blue-100 hover:text-white font-medium transition">About</a>
          <a href="#" className="text-blue-100 hover:text-white font-medium transition">Support</a>
          <a href="#" className="text-blue-100 hover:text-white font-medium transition">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default BankHeader;
