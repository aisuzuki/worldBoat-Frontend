import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { MetaHeader } from '~~/components/MetaHeader';
import { useScaffoldContractRead } from '~~/hooks/scaffold-eth';

import { useWalletClient } from 'wagmi';

interface Token {
  owner: string;
  co2OffsetPlanned: bigint;
  tokenAmountPaid: bigint;
  co2ActuallyOffset: bigint;
  fundingDateTimestamp: bigint;
  projectId: bigint;
  regionalCode: bigint;
  category: bigint;
  openFundingOrClosed: boolean;
  metadataProject: string;
  tokenId: number; // Adjust based on your token ID type
}

const ERC721TokensOverview: NextPage = () => {





  // Setup contract write hook
  const { data: tokenStats } = useScaffoldContractRead({
    contractName: "WorldBoatClimateActions",
    functionName: "getTokenStats",
    args: [1n],
  }
    
  );


  const [tokens, setTokens] = useState<Token[]>([]);
  const [expandedTokenId, setExpandedTokenId] = useState<number | null>(null);
  const { data: walletClient } = useWalletClient();
  
  console.log(walletClient)
  useEffect(() => {
    const fetchTokens = async () => {
      if (walletClient?.account.address) {
        // Add logic to fetch token balance and token IDs
        const balance = 1;
        const tokensData: Token[] = [];

        //for (let i = 0; i < balance; i++) {
          const tokenIdArg = BigInt(1n);
          // eslint-disable-next-line prettier/prettier
          const tokenStats = tokenStats({  args: [1n],});

          let tokenId = 1;
          if (tokenStats?.data) {
            tokensData.push({ tokenId, ...tokenStats.data });
          }
        //}

        setTokens(tokensData);
      }
    };

    fetchTokens();
  }, [walletClient?.account]);

  const toggleCard = (tokenId: number) => {
    setExpandedTokenId(expandedTokenId === tokenId ? null : tokenId);
  };

  return (
    <>
      <MetaHeader title="ERC721 Tokens Overview" />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl text-center mb-6">Your ERC721 Tokens</h1>
        <div className="flex overflow-x-auto gap-4">
          {tokens.map((token) => (
            <div key={token.tokenId} onClick={() => toggleCard(token.tokenId)}>
              {/* Display token details here */}
              <div className="p-4">
                <h2>Token #{token.tokenId}</h2>
                {expandedTokenId === token.tokenId && (
                  <div>
                    {/* Token details */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ERC721TokensOverview;
