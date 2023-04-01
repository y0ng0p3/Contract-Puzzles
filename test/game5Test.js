const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const threshold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';

    return { game, threshold };
  }
  it('should be a winner', async function () {
    const { game, threshold } = await loadFixture(deployContractAndSetVariables);
    
    const signer0 = ethers.provider.getSigner(0);
    let thresholdBN = ethers.BigNumber.from(threshold);
    let wallet;
    let walletBN;

    do {
      wallet = ethers.Wallet.createRandom();
      walletBN = ethers.BigNumber.from(wallet);
    } while(walletBN.lt(thresholdBN));

    wallet = wallet.connect(ethers.provider);

    signer0.sendTransaction( {
      to: wallet.address,
      value: ethers.utils.parseEthers('0.5')
    } );

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
