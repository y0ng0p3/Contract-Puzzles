const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);
    
    const signer0 = ethers.provider.getSigner(0);
    let wallet;
    
    /* Solution 1: Use BigNumber.from() to compare the threshold to our wallet address */
    const threshold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';
    const thresholdBN = ethers.BigNumber.from(threshold);
    let walletBN;
    /* do {
      wallet = ethers.Wallet.createRandom();
      walletBN = ethers.BigNumber.from(wallet.address);
    } while (thresholdBN.lt(walletBN)); */


    /* Solution 2: Find a wallet which the address begins with the same 4 first bytes as the threshold.
      Since the threshold is the higher address that begins like this, we are sure that the wallet we'll get
      will be lower than the threshold.
    */
    do {
      wallet = ethers.Wallet.createRandom();
    } while(wallet.address.slice(0, 4) != '0x00');

    wallet = wallet.connect(ethers.provider);

    signer0.sendTransaction( {
      to: wallet.address,
      value: ethers.utils.parseEther('0.5')
    } );

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
