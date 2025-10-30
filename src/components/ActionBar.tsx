import { Button } from "@/components/ui/button";
import { TrendingUp, ShoppingCart, Wallet, DollarSign, X } from "lucide-react";
import { useState } from "react";
import { BasePay } from "./BasePay";
import { useAccount } from "wagmi";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ActionBarProps {
  tokenSymbol: string;
  tokenPrice: number;
}

export const ActionBar = ({ tokenSymbol, tokenPrice }: ActionBarProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [buyAmount, setBuyAmount] = useState(100);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isConnected } = useAccount();

  return (
    <>
      {/* Floating Action Button - Mobile: bottom right, Desktop: right side */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-2 right-1/4 translate-x-1/2 sm:bottom-24 sm:right-4 sm:left-auto sm:translate-x-0 z-35 w-12 h-12 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          aria-label="Open trading panel"
          title="Trading Panel"
        >
          <DollarSign className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4 text-white group-hover:rotate-12 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 animate-ping opacity-20" />
        </button>
      )}

      {/* Expanded Panel - Professional layout with proper spacing */}
      {isExpanded && (
        <div className="fixed inset-x-0 bottom-0 z-45 bg-black/95 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4 md:p-6 max-h-[70vh] overflow-y-auto">
          {/* Header - Clean and professional */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white">Trading Panel</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close trading panel"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Compact Token Info - Improved layout */}
          <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-base">T</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">TRAVEL</p>
                  <p className="text-gray-400 text-xs">TravelStreamz Token</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm sm:text-lg">$0.0234</p>
                <p className="text-green-400 text-xs sm:text-sm">+12.5%</p>
              </div>
            </div>
            
            {/* Stats grid with better spacing */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Volume</p>
                <p className="text-white font-semibold text-sm">$1.2M</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">Holders</p>
                <p className="text-white font-semibold text-sm">8.9K</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">MCap</p>
                <p className="text-white font-semibold text-sm">$45.6M</p>
              </div>
            </div>
          </div>

          {/* Quick Stats - Better organized */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Views</p>
              <p className="text-white font-bold text-sm sm:text-base">1.2K</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">XP Earned</p>
              <p className="text-white font-bold text-sm sm:text-base">450</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Betting Pool</p>
              <p className="text-white font-bold text-sm sm:text-base">$890</p>
            </div>
          </div>

          {/* Connect Wallet Status - Professional styling */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm">Connect wallet to start trading</span>
            </div>
          </div>

          {/* Action Buttons - Improved spacing and layout */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Bet Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Bet Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Place Your Bet</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Bet Amount</label>
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                        placeholder="Enter amount"
                      />
                    </div>
                    <BasePay
                      amount={betAmount}
                      currency="USD"
                      onSuccess={() => console.log('Bet placed successfully')}
                      onError={(error) => console.error('Bet failed:', error)}
                    />
                  </div>
                </DialogContent>
              </Dialog>

            {/* Buy Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Tokens
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Buy Tokens</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Buy Amount</label>
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                      placeholder="Enter amount"
                    />
                  </div>
                  <BasePay
                    amount={buyAmount}
                    currency="USD"
                    onSuccess={() => console.log('Purchase successful')}
                    onError={(error) => console.error('Purchase failed:', error)}
                  />
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {/* Quick Amount Chips - Better organized */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {[5, 10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setBetAmount(amount);
                  setBuyAmount(amount);
                }}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                ${amount}
              </button>
            ))}
          </div>

          {/* Powered by Base Pay - Professional footer */}
          <div className="text-center pt-4 border-t border-white/10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-xl border border-blue-500/30">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-blue-300 text-sm font-medium">Powered by Base Pay</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
