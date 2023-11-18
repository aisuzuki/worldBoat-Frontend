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
  const { data: stat } = useScaffoldContractRead({
    contractName: "WorldBoatClimateActions",
    functionName: "getTokenStats",
    args: [1n],
  }
    
  );


  const [tokens, setTokens] = useState<Token[]>([]);
  const [expandedTokenId, setExpandedTokenId] = useState<number | null>(null);
  const { data: walletClient } = useWalletClient();
  
  console.log(stat)
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


          let tokenId = 1;
          const owner = stat?.owner || "";
          const co2OffsetPlanned = stat?.co2OffsetPlanned || 0n;
          const tokenAmountPaid = stat?.tokenAmountPaid || 0n;
          const co2ActuallyOffset = stat?.co2ActuallyOffset || 0n;
          const fundingDateTimestamp = stat?.fundingDateTimestamp || 0n;
          const projectId = stat?.projectId || 0n;
          const regionalCode = stat?.regionalCode || 0n;
          const category = stat?.category || 0n;
          const openFundingOrClosed = stat?.openFundingOrClosed || false;
          const metadataProject = stat?.metadataProject || "";
          tokensData.push({ tokenId, owner, co2OffsetPlanned, tokenAmountPaid, co2ActuallyOffset, fundingDateTimestamp, projectId, regionalCode, category, openFundingOrClosed, metadataProject});
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
